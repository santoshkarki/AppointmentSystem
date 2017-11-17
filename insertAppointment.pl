#!/Strawberry/perl/bin/perl.exe -T

use DBI;
use strict;
use CGI;


my $driver="SQLite";
my $database="appointment.db";

#Database source name
my $dsn="DBI:$driver:dbname=$database";
my $userid="";
my $password="";

#establish db connection using DBI module
my $dbh = DBI -> connect($dsn,$userid,$password,{RaiseError=>1}) or die $DBI::errstr;


my $cgi = new CGI;
print $cgi->header("application/json");

#get and store form values
my $date = $cgi->param('txtDate');
my $time = $cgi->param('txtTime');
my $description = $cgi->param('txtDescription');

# create a table record
$dbh->do("CREATE TABLE IF NOT EXISTS record(datetime TEXT,description TEXT)");


#insert into record
my $stmh= $dbh -> prepare("insert into record(datetime, description) values (?,?);");

#execute insert statement and combine date and time
$stmh->execute($date." ".$time, $description) or die $DBI::errstr;

$dbh->disconnect();

print '{"msg":"success"}';

#use CGI;
#use JSON;
#
#   $query = CGI->new();
#
#   $text = "";
#
##- Getting the request method
#   $text .= "Request method = ".$query->request_method()."\n";
#
##- Getting input data from the query string and from the data content
#   $text .= "Names and values from param():\n";
#   @names = decode_json $query->param();
#   foreach $name (@names) {
#      $text .= "   $name = ".$query->param($name)."\n";
#   }
#
##- Getting request headers
#   $text .= "Names and values from http():\n";
#   @names = $query->http();
#   foreach $name (@names) {
#      $text .= "   $name = ".$query->http($name)."\n";
#   }
#
#   print $query->header();
#   print $query->start_html(-title=>'CGI-pm-Request-Info.pl');
#   print $query->pre($text);
#   print $query->end_html();