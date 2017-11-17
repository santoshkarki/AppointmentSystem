#!/Strawberry/perl/bin/perl.exe -T

use strict;
use CGI;
use DBI;
use JSON;


my $driver="SQLite";
my $database="appointment.db";

#Database source name
my $dsn="DBI:$driver:dbname=$database";
my $userid="";
my $password="";

#establish database connection using DBI module
my $dbh = DBI -> connect($dsn,$userid,$password,{RaiseError=>1});

my $cgi = new CGI;
print $cgi->header("application/json");

my @output;

#get and store query parameter
my $txtSearch = $cgi->param('searchData');
 
#receive data from the database
my $sth ;
if($txtSearch){
	 $sth = $dbh->prepare("select  datetime,description from record where description like ?");
	 $sth->execute($txtSearch.'%') or die $DBI::errstr;
}
else{
  $sth = $dbh->prepare("select  datetime,description from record");
  $sth->execute() or die $DBI::errstr;
 }

while ( my $row = $sth->fetchrow_hashref ){
    push @output, $row;
}



#convert to json
print to_json(\@output);

$dbh->disconnect();
